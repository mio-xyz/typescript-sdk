# @mio-xyz/sdk

Mio SDK for authentication and personalized context access. It helps your app exchange OAuth tokens and fetch **Mio Context**—structured facts about each user—from their existing tools (like email and calendar).

## Installation

```bash
npm add @mio-xyz/sdk
yarn add @mio-xyz/sdk
pnpm add @mio-xyz/sdk
```

## Quick Start

### Backend usage (exchange authorization code for tokens)

```typescript
import { Mio } from '@mio-xyz/sdk/server';

// Initialize once in your app (e.g. on server startup)
Mio.init({
  clientId: process.env.MIO_CLIENT_ID!,
  redirectUrl: process.env.MIO_REDIRECT_URL!,
  clientSecret: process.env.MIO_CLIENT_SECRET!
});

// In your API route
app.post('/api/exchange-token', async (req, res) => {
  const { code } = req.body;
  const mio = Mio.getInstance();
  const tokens = await mio.exchangeCodeForTokens(code);

  // Persist refreshToken if you want to refresh access tokens later
  // await saveTokensForUser(userId, tokens);

  res.json(tokens);
});
```

### Frontend usage (Next.js / React)

Wrap your app with `MioProvider` to initialize the SDK once, then consume `useMio` anywhere in the tree.

```typescript
// app/providers.tsx
'use client';

import type { ReactNode } from 'react';
import { MioProvider } from '@mio-xyz/sdk/react';

const mioConfig = {
  clientId: process.env.NEXT_PUBLIC_MIO_CLIENT_ID!,
  redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/mio/callback`,
  exchangeTokenUrl: '/api/exchange-token'
};

export function Providers({ children }: { children: ReactNode }) {
  return <MioProvider config={mioConfig}>{children}</MioProvider>;
}
```

```typescript
// app/chat/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useMio } from '@mio-xyz/sdk/react';

export default function ChatPage() {
  const { connect, handleMioCallback, getContext, isLoading, error } = useMio();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    handleMioCallback()
      .then(tokens => {
        if (tokens?.accessToken) {
          setAccessToken(tokens.accessToken);
        }
      })
      .catch(() => {
        // Ignore when there is no `code` in the URL
      });
  }, [handleMioCallback]);

  const handleAsk = async () => {
    // You can choose to connect before the context request or in a separate button
    if (!accessToken) {
      await connect(); // kicks off OAuth if needed
      return;
    }

    const response = await getContext({
      query: 'How should we greet this user?',
      accessToken
    });

    setAnswer(response);
  };

  return (
    ...
  );
}
```

## API Reference

### Mio (frontend)

Frontend SDK for browser environments.

#### Methods

- `init(config: MioClientSDKInitConfig)` - Initialize the SDK singleton.
- `getInstance()` - Get the initialized SDK instance (throws if not initialized).
- `connect()` - Redirect to the Mio dashboard OAuth flow.
- `exchangeCode(code)` - Exchange an authorization code for tokens via your backend `exchangeTokenUrl`.
- `getContext({ accessToken, query })` - Fetch Mio Context for a given user and query.
- `getContextSummary({ accessToken })` - Fetch the latest Mio Context summary for the current user.

### Mio (backend)

Backend SDK for server environments.

#### Methods

- `init(config: MioServerSDKInitConfig)` - Initialize the SDK singleton.
- `getInstance()` - Get the initialized SDK instance (throws if not initialized).
- `exchangeCodeForTokens(code)` - Exchange an authorization code for tokens using the client secret.
- `refreshTokens(refreshToken)` - Refresh access and refresh tokens using a refresh token.
- `getContext({ accessToken, query })` - Fetch Mio Context for a user on the backend (batch jobs, workers, etc.).
- `getContextSummary({ accessToken })` - Retrieve the current Mio Context summary from the context service.

### `useMio` hook (frontend)

React hook for frontend integration.

#### Returns

- `isLoading` - Boolean indicating loading state
- `error` - Error message if any
- `connect()` - Function to initiate the OAuth flow
- `handleMioCallback()` - Function to handle the OAuth callback and exchange the code
- `getContext({ accessToken, query })` - Fetch Mio Context for a user
- `getContextSummary({ accessToken })` - Retrieve the current Mio Context summary for a user

## Configuration

Key minimal configuration types exposed by the SDK:

```typescript
interface MioClientSDKInitConfig {
  clientId: string;
  redirectUrl: string;
  exchangeTokenUrl: string;
}

interface MioServerSDKInitConfig {
  clientId: string;
  redirectUrl: string;
  clientSecret: string;
}
```
