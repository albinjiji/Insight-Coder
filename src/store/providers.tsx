'use client';

import { Provider } from "react-redux";
import { store } from "./store";
import AuthProvider from "@/features/auth/AuthProvider";

type Props = { children: React.ReactNode };

export default function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
