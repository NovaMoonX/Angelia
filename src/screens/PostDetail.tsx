import { getColorPair } from '@/lib/channel';
import {
  joinConversation,
  removePostReaction,
  updatePostComments,
  updatePostReactions,
} from '@/store/actions/postActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectPostAuthor,
  selectPostById,
  selectPostChannel,
} from '@/store/slices/postsSlice';
import generateId from '@/util/generateId';
import { ChatMessage } from '@components/ChatMessage';
import { ReactionDisplay } from '@components/ReactionDisplay';
import { getPostAuthorName, type Comment, type Reaction } from '@lib/post';
import {
  COMMON_EMOJIS,
  JOIN_CONVERSATION_PHRASES,
  START_CONVERSATION_PHRASES,
  getRandomPhrase,
  isValidEmoji,
} from '@lib/post/post.constants';
import { getRelativeTime } from '@lib/timeUtils';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Carousel,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const post = useAppSelector((state) => selectPostById(state, id));
  const postAuthor = useAppSelector((state) => selectPostAuthor(state, post));
  const postChannel = useAppSelector((state) => selectPostChannel(state, post));

  const [newMessage, setNewMessage] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');
  const [emojiError, setEmojiError] = useState('');

  // Get saved scroll position from sessionStorage
  const handleBackToFeed = () => {
    const scrollPosition = Number(
      sessionStorage.getItem('feedScrollPosition') || 0,
    );
    const displayedCount = Number(
      sessionStorage.getItem('feedDisplayedCount') || 5,
    );

    navigate('/feed', {
      state: { scrollPosition, displayedCount },
    });
  };

  // Group reactions by emoji and sort by count
  const groupedReactions = useMemo(() => {
    if (!post?.reactions) return [];

    const groups = post?.reactions.reduce(
      (acc, reaction) => {
        if (!acc[reaction.emoji]) {
          acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction.userId);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return Object.entries(groups)
      .map(([emoji, userIds]) => ({ emoji, userIds }))
      .sort((a, b) => b.userIds.length - a.userIds.length);
  }, [post?.reactions]);

  // Use media array if available, otherwise fall back to images
  const mediaItems = useMemo(() => {
    if (!post) return [];
    return post.media ?? [];
  }, [post]);

  const handleCarouselIndexChange = (newIndex: number) => {
    // Pause all videos when carousel index changes
    videoRefs.current.forEach((video, index) => {
      if (index !== newIndex && !video.paused) {
        video.pause();
      }
    });
  };

  const renderMedia = (item: { type: string; url: string }, index: number) => {
    return (
      <a
        href={item.url}
        target='_blank'
        rel='noopener noreferrer'
        className='relative flex h-full w-full items-center justify-center bg-black'
      >
        {item.type === 'video' ? (
          <video
            ref={(el) => {
              if (el) {
                videoRefs.current.set(index, el);
              } else {
                videoRefs.current.delete(index);
              }
            }}
            src={item.url}
            controls
            className='h-auto w-full'
            preload='metadata'
          />
        ) : (
          <img
            src={item.url}
            alt={
              index === 0 && mediaItems.length === 1
                ? 'Post content'
                : `Post content ${index + 1}`
            }
            className='h-auto w-full object-cover'
            loading='lazy'
          />
        )}
      </a>
    );
  };

  if (!post) {
    return (
      <div className='page flex flex-col items-center justify-center'>
        <div className='space-y-4 text-center'>
          <h1 className='text-foreground text-2xl font-bold'>Post not found</h1>
          <Button onClick={handleBackToFeed}>Back to Feed</Button>
        </div>
      </div>
    );
  }

  const relativeTime = getRelativeTime(post.timestamp);

  const colors = getColorPair(postChannel);

  const hasUserReacted =
    currentUser &&
    post.reactions.some((reaction) => reaction.userId === currentUser.id);

  const isEnrolledInConversation =
    currentUser && post.conversationEnrollees.includes(currentUser.id);

  const handleReaction = (emoji: string) => {
    if (!post || !currentUser) return;

    // Check if this reaction already exists with the current user
    const existingReaction = post.reactions.find(
      (r) => r.emoji === emoji && r.userId === currentUser.id,
    );

    if (existingReaction) {
      // Remove the reaction
      dispatch(
        removePostReaction({ postId: post.id, emoji, userId: currentUser.id }),
      );
    } else {
      // Add the reaction
      const newReaction: Reaction = {
        emoji,
        userId: currentUser.id,
      };
      dispatch(updatePostReactions({ postId: post.id, newReaction }));
    }
  };

  const handleJoinConversation = () => {
    if (!post || !currentUser) return;

    dispatch(joinConversation({ postId: post.id, userId: currentUser.id }));
  };

  const handleCustomEmojiSubmit = () => {
    setEmojiError('');

    if (!customEmoji.trim()) {
      setEmojiError('Please enter an emoji');
      return;
    }

    if (!isValidEmoji(customEmoji)) {
      setEmojiError('Please enter a valid emoji (not text or numbers)');
      return;
    }

    // Add the custom emoji as a reaction
    handleReaction(customEmoji);
    setCustomEmoji('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !post || !currentUser) return;

    const newComment: Comment = {
      id: generateId('postComment'),
      authorId: currentUser.id,
      text: newMessage,
      timestamp: Date.now(),
    };

    dispatch(updatePostComments({ postId: post.id, newComment }));
    setNewMessage('');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-2xl space-y-6 px-4 py-6'>
        <div className='flex items-center gap-3'>
          <Button
            variant='tertiary'
            size='sm'
            onClick={handleBackToFeed}
            className='shrink-0'
          >
            ← Back
          </Button>
          <Link
            to='/account'
            aria-label='Go to account'
            className='focus:ring-primary ml-auto rounded-full focus:ring-2 focus:outline-none'
          >
            <Avatar preset={currentUser.avatar} size='md' />
          </Link>
        </div>

        <Card className='relative overflow-hidden p-0'>
          <div className='space-y-3 p-4'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Avatar preset={postAuthor?.avatar} size='md' />
                <div className='flex flex-col'>
                  <span className='text-foreground font-semibold'>
                    {getPostAuthorName(postAuthor, currentUser)}
                  </span>
                  <span className='text-foreground/60 text-sm'>
                    {relativeTime}
                  </span>
                </div>
              </div>
              <Badge
                variant='base'
                className='text-xs font-medium'
                style={{
                  backgroundColor: colors.backgroundColor,
                  borderColor: colors.backgroundColor,
                  color: colors.textColor,
                }}
              >
                {postChannel?.name || 'Unknown Channel'}
              </Badge>
            </div>

            <p className='text-foreground leading-relaxed whitespace-pre-wrap'>
              {post.text}
            </p>
          </div>

          {mediaItems.length > 0 &&
            (mediaItems.length === 1 ? (
              <div className='w-full'>{renderMedia(mediaItems[0], 0)}</div>
            ) : (
              <div className='w-full'>
                <Carousel
                  className='w-full'
                  buttonPosition='interior'
                  onIndexChange={handleCarouselIndexChange}
                >
                  {mediaItems.map((item, index) => (
                    <div
                      key={`${post.id}-media-${index}`}
                      className='h-full w-full'
                    >
                      {renderMedia(item, index)}
                    </div>
                  ))}
                </Carousel>
              </div>
            ))}
        </Card>

        {!hasUserReacted ? (
          <Card>
            <div className='space-y-4'>
              <div className='space-y-2 text-center'>
                <h3 className='text-foreground text-lg font-semibold'>
                  React to see what others think
                </h3>
                <p className='text-foreground/60 text-sm'>
                  Share your reaction to unlock the conversation
                </p>
              </div>
              <div className='flex flex-wrap justify-center gap-2'>
                {COMMON_EMOJIS.map((emoji) => (
                  <Button
                    key={emoji}
                    variant='outline'
                    size='lg'
                    onClick={() => handleReaction(emoji)}
                    className='px-4 py-2 text-2xl'
                  >
                    {emoji}
                  </Button>
                ))}
                <Input
                  value={customEmoji}
                  onChange={(e) => {
                    setCustomEmoji(e.target.value);
                    setEmojiError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomEmojiSubmit();
                    }
                  }}
                  placeholder='Custom'
                  className='h-12 w-20 text-center text-2xl'
                  maxLength={1}
                  autoComplete='off'
                />
              </div>
              {emojiError && (
                <p className='mt-2 text-center text-xs text-red-500'>
                  {emojiError}
                </p>
              )}
            </div>
          </Card>
        ) : (
          <Tabs defaultValue='reactions' tabsWidth='full'>
            <TabsList>
              <TabsTrigger value='reactions'>
                Reactions ({post.reactions.length})
              </TabsTrigger>
              <TabsTrigger value='conversation'>
                Conversation ({post.comments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value='reactions' className='mt-4'>
              <Card>
                <div className='space-y-4'>
                  <h3 className='text-foreground text-lg font-semibold'>
                    Reactions
                  </h3>
                  {groupedReactions.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {groupedReactions.map((group) => {
                        const isUserReacted = group.userIds.includes(
                          currentUser.id,
                        );

                        return (
                          <ReactionDisplay
                            key={group.emoji}
                            emoji={group.emoji}
                            count={group.userIds.length}
                            isUserReacted={isUserReacted}
                            onClick={() => handleReaction(group.emoji)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className='text-foreground/60 text-sm'>
                      No reactions yet
                    </p>
                  )}

                  <div className='border-foreground/10 border-t pt-4'>
                    <p className='text-foreground/60 mb-3 text-sm'>
                      Add another reaction
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {COMMON_EMOJIS.map((emoji) => {
                        const isUserReacted = post.reactions.some(
                          (r) =>
                            r.emoji === emoji && r.userId === currentUser.id,
                        );

                        return (
                          <Button
                            key={emoji}
                            variant='outline'
                            size='md'
                            onClick={() => handleReaction(emoji)}
                            className={join(
                              'px-3 py-2 text-xl transition-all',
                              isUserReacted
                                ? 'bg-primary/10 border-primary/30'
                                : 'bg-transparent',
                            )}
                          >
                            {emoji}
                          </Button>
                        );
                      })}
                      <Input
                        value={customEmoji}
                        onChange={(e) => {
                          setCustomEmoji(e.target.value);
                          setEmojiError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCustomEmojiSubmit();
                          }
                        }}
                        placeholder='Custom'
                        className='h-10 w-20 text-center text-xl'
                        maxLength={2}
                        autoComplete='off'
                      />
                    </div>
                    {emojiError && (
                      <p className='mt-2 text-xs text-red-500'>{emojiError}</p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value='conversation' className='mt-4'>
              <Card>
                {!isEnrolledInConversation ? (
                  <div className='space-y-4 py-8 text-center'>
                    <h3 className='text-foreground text-lg font-semibold'>
                      {post.comments.length === 0
                        ? 'Start the conversation'
                        : 'Join the conversation'}
                    </h3>
                    <p className='text-foreground/60 text-sm'>
                      {post.comments.length === 0
                        ? 'Enroll to share your thoughts'
                        : 'Enroll to see messages and share your thoughts'}
                    </p>
                    <Button onClick={handleJoinConversation}>
                      {post.comments.length === 0
                        ? 'Start Conversation'
                        : 'Join Conversation'}
                    </Button>
                    <p className='text-foreground/70 mt-2 text-sm italic'>
                      {post.comments.length === 0
                        ? getRandomPhrase(START_CONVERSATION_PHRASES)
                        : getRandomPhrase(JOIN_CONVERSATION_PHRASES)}
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <h3 className='text-foreground text-lg font-semibold'>
                      Conversation
                    </h3>

                    {post.comments.length === 0 ? (
                      <div className='py-8 text-center'>
                        <p className='text-foreground/60 text-sm'>
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-2'>
                        {post.comments.map((comment) => (
                          <ChatMessage
                            key={comment.id}
                            authorId={comment.authorId}
                            text={comment.text}
                            timestamp={comment.timestamp}
                            isCurrentUser={comment.authorId === currentUser.id}
                          />
                        ))}
                      </div>
                    )}

                    <div className='border-foreground/10 border-t pt-4'>
                      <div className='space-y-3'>
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder='Share your thoughts...'
                          rows={3}
                          className='w-full'
                        />
                        <div className='flex justify-end'>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
