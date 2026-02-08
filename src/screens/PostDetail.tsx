import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Card,
  Carousel,
  Badge,
  Avatar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { ReactionDisplay } from '@components/ReactionDisplay';
import { ChatMessage } from '@components/ChatMessage';
import { CHANNEL_COLOR_MAP } from '@lib/channelColors';
import {
  mockTidings,
  mockCurrentUser,
  type Reaction,
  type Comment,
} from '@lib/mockData';

const COMMON_EMOJIS = ['❤️', '👍', '😊', '🎉', '😮', '😢', '😄', '🔥'];

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  }
  if (hours > 0) {
    return `${hours}h ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ago`;
  }

  return 'Just now';
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tiding, setTiding] = useState(() => {
    const foundTiding = mockTidings.find((t) => t.id === id);
    return foundTiding;
  });

  const [newMessage, setNewMessage] = useState('');

  if (!tiding) {
    return (
      <div className='page flex flex-col items-center justify-center'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-bold text-foreground'>
            Post not found
          </h1>
          <Button onClick={() => navigate('/feed')}>Back to Feed</Button>
        </div>
      </div>
    );
  }

  const relativeTime = getRelativeTime(tiding.timestamp);

  const getColorPair = () => {
    const colorData = CHANNEL_COLOR_MAP.get(tiding.channelColor);
    
    const result = {
      backgroundColor: colorData?.value || '#c7d2fe',
      textColor: colorData?.textColor || '#4338ca',
    };
    
    return result;
  };

  const colors = getColorPair();

  const hasUserReacted = tiding.reactions.some((reaction) =>
    reaction.userIds.includes(mockCurrentUser.id)
  );

  const isEnrolledInConversation = tiding.conversationEnrollees.includes(
    mockCurrentUser.id
  );

  const sortedReactions = useMemo(() => {
    const result = [...tiding.reactions].sort(
      (a, b) => b.userIds.length - a.userIds.length
    );
    
    return result;
  }, [tiding.reactions]);

  const handleReaction = (emoji: string) => {
    setTiding((prev) => {
      if (!prev) return prev;

      const existingReactionIndex = prev.reactions.findIndex(
        (r) => r.emoji === emoji
      );

      let newReactions: Reaction[];

      if (existingReactionIndex !== -1) {
        const existingReaction = prev.reactions[existingReactionIndex];
        const userHasReacted =
          existingReaction.userIds.includes(mockCurrentUser.id);

        if (userHasReacted) {
          const updatedUserIds = existingReaction.userIds.filter(
            (userId) => userId !== mockCurrentUser.id
          );

          if (updatedUserIds.length === 0) {
            newReactions = prev.reactions.filter((_, i) => i !== existingReactionIndex);
          } else {
            newReactions = [...prev.reactions];
            newReactions[existingReactionIndex] = {
              ...existingReaction,
              userIds: updatedUserIds,
            };
          }
        } else {
          newReactions = [...prev.reactions];
          newReactions[existingReactionIndex] = {
            ...existingReaction,
            userIds: [...existingReaction.userIds, mockCurrentUser.id],
          };
        }
      } else {
        newReactions = [
          ...prev.reactions,
          { emoji, userIds: [mockCurrentUser.id] },
        ];
      }

      const result = {
        ...prev,
        reactions: newReactions,
      };

      return result;
    });
  };

  const handleJoinConversation = () => {
    setTiding((prev) => {
      if (!prev) return prev;

      const result = {
        ...prev,
        conversationEnrollees: [
          ...prev.conversationEnrollees,
          mockCurrentUser.id,
        ],
      };

      return result;
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      authorId: mockCurrentUser.id,
      authorName: `${mockCurrentUser.firstName} ${mockCurrentUser.lastName}`,
      authorAvatar: mockCurrentUser.avatar,
      text: newMessage,
      timestamp: Date.now(),
    };

    setTiding((prev) => {
      if (!prev) return prev;

      const result = {
        ...prev,
        comments: [...prev.comments, newComment],
      };

      return result;
    });

    setNewMessage('');
  };

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-2xl px-4 py-6 space-y-6'>
        <div className='flex items-center gap-3'>
          <Button
            variant='tertiary'
            size='sm'
            onClick={() => navigate('/feed')}
            className='shrink-0'
          >
            ← Back
          </Button>
          <Link
            to='/account'
            aria-label='Go to account'
            className='ml-auto focus:outline-none focus:ring-2 focus:ring-primary rounded-full'
          >
            <Avatar preset={mockCurrentUser.avatar} size='md' />
          </Link>
        </div>

        <Card className='relative overflow-hidden p-0'>
          {tiding.isHighPriority && (
            <div
              className='absolute top-0 left-0 z-10 h-0 w-0 border-b-50 border-l-50 border-b-transparent border-l-red-500'
              aria-label='High priority post'
              role='img'
            >
              <span
                className='absolute -top-11.25 -left-11.25 -rotate-45 transform text-xs font-bold text-white'
                aria-hidden='true'
              >
                !
              </span>
            </div>
          )}

          <div className='space-y-3 p-4'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Avatar preset={tiding.authorAvatar} size='md' />
                <div className='flex flex-col'>
                  <span className='text-foreground font-semibold'>
                    {tiding.authorName}
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
                {tiding.channelName}
              </Badge>
            </div>

            <p className='text-foreground leading-relaxed whitespace-pre-wrap'>
              {tiding.text}
            </p>
          </div>

          {tiding.images.length > 0 && (
            <div className='w-full'>
              {tiding.images.length === 1 ? (
                <img
                  src={tiding.images[0]}
                  alt='Post content'
                  className='h-auto w-full object-cover'
                  loading='lazy'
                />
              ) : (
                <Carousel className='w-full' buttonPosition='interior'>
                  {tiding.images.map((image, index) => (
                    <div key={`${tiding.id}-image-${index}`} className='w-full'>
                      <img
                        src={image}
                        alt={`Post content ${index + 1}`}
                        className='h-auto w-full object-cover'
                        loading='lazy'
                      />
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
          )}
        </Card>

        {!hasUserReacted ? (
          <Card>
            <div className='space-y-4'>
              <div className='text-center space-y-2'>
                <h3 className='text-lg font-semibold text-foreground'>
                  React to see what others think
                </h3>
                <p className='text-foreground/60 text-sm'>
                  Share your reaction to unlock the conversation
                </p>
              </div>
              <div className='flex flex-wrap gap-2 justify-center'>
                {COMMON_EMOJIS.map((emoji) => (
                  <Button
                    key={emoji}
                    variant='outline'
                    size='lg'
                    onClick={() => handleReaction(emoji)}
                    className='text-2xl px-4 py-2'
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue='reactions' tabsWidth='full'>
            <TabsList>
              <TabsTrigger value='reactions'>
                Reactions ({sortedReactions.reduce((sum, r) => sum + r.userIds.length, 0)})
              </TabsTrigger>
              <TabsTrigger value='conversation'>
                Conversation ({tiding.comments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value='reactions' className='mt-4'>
              <Card>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-foreground'>
                    Reactions
                  </h3>
                  {sortedReactions.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {sortedReactions.map((reaction) => {
                        const isUserReacted =
                          reaction.userIds.includes(mockCurrentUser.id);
                        
                        return (
                          <ReactionDisplay
                            key={reaction.emoji}
                            emoji={reaction.emoji}
                            count={reaction.userIds.length}
                            isUserReacted={isUserReacted}
                            onClick={() => handleReaction(reaction.emoji)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className='text-foreground/60 text-sm'>
                      No reactions yet
                    </p>
                  )}

                  <div className='border-t border-foreground/10 pt-4'>
                    <p className='text-foreground/60 text-sm mb-3'>
                      Add another reaction
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {COMMON_EMOJIS.map((emoji) => {
                        const existingReaction = tiding.reactions.find(
                          (r) => r.emoji === emoji
                        );
                        const isUserReacted = existingReaction?.userIds.includes(
                          mockCurrentUser.id
                        );

                        return (
                          <Button
                            key={emoji}
                            variant={isUserReacted ? 'base' : 'outline'}
                            size='md'
                            onClick={() => handleReaction(emoji)}
                            className={join(
                              'text-xl px-3 py-2',
                              isUserReacted && 'ring-2 ring-primary/30'
                            )}
                          >
                            {emoji}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value='conversation' className='mt-4'>
              <Card>
                {!isEnrolledInConversation ? (
                  <div className='space-y-4 text-center py-8'>
                    <h3 className='text-lg font-semibold text-foreground'>
                      Join the conversation
                    </h3>
                    <p className='text-foreground/60 text-sm'>
                      Enroll to see messages and share your thoughts
                    </p>
                    <Button onClick={handleJoinConversation}>
                      Join Conversation
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-foreground'>
                      Conversation
                    </h3>

                    {tiding.comments.length === 0 ? (
                      <div className='py-8 text-center'>
                        <p className='text-foreground/60 text-sm'>
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-0 divide-y divide-foreground/10'>
                        {tiding.comments.map((comment) => (
                          <ChatMessage
                            key={comment.id}
                            authorName={comment.authorName}
                            authorAvatar={comment.authorAvatar}
                            text={comment.text}
                            timestamp={comment.timestamp}
                          />
                        ))}
                      </div>
                    )}

                    <div className='border-t border-foreground/10 pt-4'>
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
