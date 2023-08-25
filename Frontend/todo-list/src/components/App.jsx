import AppRoutes from "./AppRoutes";
import { useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query"

import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from "react-router-dom";
import { setUpMutation } from "$/utils/queryClient";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

function App() {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
      },
    })
  })
  useEffect(() => {
    setUpMutation(queryClient)
  }, [queryClient])

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, onSuccess() { console.log(queryClient); queryClient.resumePausedMutations() } }}>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  )
}

export default App
