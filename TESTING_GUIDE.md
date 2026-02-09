# Testing Guide: Demo Routes & Firebase Authentication

This guide outlines how to test the new authentication system and demo routes implementation.

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Copy your Firebase configuration values

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Test Scenarios

### 1. Demo Routes (Public Access)

**Objective**: Verify demo routes are publicly accessible without authentication

**Test Cases**:
- [ ] Navigate to `/demo/feed` - should show feed with mock data
- [ ] Click on a post card - should navigate to `/demo/tiding/:id`
- [ ] Click avatar in top right - should navigate to `/demo/account`
- [ ] Click notifications bell - should navigate to `/demo/account?view=notifications`
- [ ] Verify all demo screens show mock data
- [ ] Verify no authentication is required

**Expected Behavior**:
- All demo routes accessible without login
- Navigation works correctly within demo context
- Mock data displays properly

### 2. Protected Routes (Authentication Required)

**Objective**: Verify protected routes require authentication

**Test Cases**:
- [ ] Navigate to `/feed` while logged out - should redirect to `/auth`
- [ ] Navigate to `/tiding/:id` while logged out - should redirect to `/auth`
- [ ] Navigate to `/account` while logged out - should redirect to `/auth`
- [ ] After redirect, URL should include `?redirect=` parameter with intended destination

**Expected Behavior**:
- Immediate redirect to auth page
- Redirect URL preserved in query parameters
- Loading state shows briefly during auth check

### 3. Sign Up Flow

**Objective**: Test complete user registration process

**Test Cases**:
- [ ] Navigate to `/auth?mode=signup`
- [ ] Enter valid email and password
- [ ] Click "Continue" to proceed to step 2
- [ ] Fill in First Name, Last Name
- [ ] Select an avatar
- [ ] Enter a fun fact
- [ ] Click "Complete Signup"
- [ ] Verify account creation
- [ ] Check email for verification link
- [ ] Click verification link
- [ ] Verify redirect to intended page or feed

**Expected Behavior**:
- Form validation works correctly
- Error messages display for invalid inputs
- Account created in Firebase
- Verification email sent
- User redirected to `/verify-email` page
- Email verification link works

### 4. Sign In Flow

**Objective**: Test user login process

**Test Cases**:
- [ ] Navigate to `/auth?mode=login`
- [ ] Enter registered email and password
- [ ] Click "Continue"
- [ ] Verify successful login
- [ ] Verify redirect to intended page or feed

**Expected Behavior**:
- Valid credentials allow login
- Invalid credentials show error message
- User redirected after successful login
- Auth state persists across page refreshes

### 5. Email Verification

**Objective**: Test email verification requirement

**Test Cases**:
- [ ] Create new account without verifying email
- [ ] Try to access `/feed` - should redirect to `/verify-email`
- [ ] Click "Resend Link" on verify email page
- [ ] Verify new email received
- [ ] Click verification link in email
- [ ] Verify access granted to protected routes

**Expected Behavior**:
- Unverified users cannot access protected routes
- Redirect to `/verify-email` page
- Resend functionality works
- After verification, access granted

### 6. Redirect Preservation

**Objective**: Test that users are redirected to intended page after auth

**Test Cases**:
- [ ] While logged out, navigate to `/account`
- [ ] Should redirect to `/auth?redirect=%2Faccount`
- [ ] Complete login
- [ ] Should redirect to `/account`

**Expected Behavior**:
- Redirect URL preserved during auth flow
- User returned to intended page after login
- Works for both signup and login

### 7. Sign Out

**Objective**: Test sign out functionality

**Test Cases**:
- [ ] Navigate to `/account` while logged in
- [ ] Click "Sign Out" button
- [ ] Confirm sign out in modal
- [ ] Verify redirect to login page
- [ ] Try accessing protected route - should redirect to auth

**Expected Behavior**:
- Confirmation modal appears
- User signed out from Firebase
- Redirect to login page
- Auth state cleared
- Protected routes no longer accessible

### 8. Navigation Between Demo and Protected Routes

**Objective**: Verify seamless navigation between demo and authenticated experiences

**Test Cases**:
- [ ] From `/auth` page, click demo feed link
- [ ] Should navigate to `/demo/feed`
- [ ] From demo feed, try to access real feed
- [ ] Should redirect to auth if not logged in
- [ ] After login, verify can access both demo and protected routes

**Expected Behavior**:
- Link to demo from auth page works
- Demo accessible without login
- Protected routes require auth
- Both available when logged in

### 9. Error Handling

**Objective**: Test error states and messages

**Test Cases**:
- [ ] Try login with wrong password
- [ ] Try login with non-existent email
- [ ] Try signup with existing email
- [ ] Try signup with weak password
- [ ] Test rate limiting (multiple failed attempts)

**Expected Behavior**:
- Appropriate error messages displayed
- Errors shown in Callout component
- Toast notifications for important events
- User can retry after error

### 10. Session Persistence

**Objective**: Test auth state persistence

**Test Cases**:
- [ ] Login successfully
- [ ] Refresh page
- [ ] Verify still logged in
- [ ] Close tab and reopen
- [ ] Verify still logged in
- [ ] Navigate between pages
- [ ] Verify auth state maintained

**Expected Behavior**:
- Auth state persists across page refreshes
- Auth state persists across browser sessions
- No re-authentication required

## Common Issues

### Issue: Environment variables not loading
**Solution**: 
- Ensure `.env` file is in root directory
- Restart dev server after creating `.env`
- Check that variables start with `VITE_`

### Issue: Firebase errors in console
**Solution**:
- Verify Firebase configuration values
- Check Firebase Authentication is enabled
- Ensure Email/Password provider is enabled
- Check Firebase project permissions

### Issue: Email verification not working
**Solution**:
- Check spam folder
- Verify email templates in Firebase Console
- Check authorized domains in Firebase settings
- Ensure verification emails are enabled

### Issue: Redirects not working
**Solution**:
- Check browser console for errors
- Verify routing configuration
- Check that ProtectedRoutes component is wrapping correctly
- Clear browser cache and cookies

## Success Criteria

All test scenarios should pass with the following verified:
- ✅ Demo routes publicly accessible
- ✅ Protected routes require authentication
- ✅ Email verification enforced
- ✅ Sign up flow completes successfully
- ✅ Sign in flow works correctly
- ✅ Email verification works
- ✅ Redirect preservation functions
- ✅ Sign out functionality works
- ✅ Error handling is user-friendly
- ✅ Session persistence works
- ✅ Navigation smooth between demo and protected routes

## Reporting Issues

When reporting issues, please include:
1. Test scenario being attempted
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser and version
5. Console errors (if any)
6. Screenshots (if applicable)
