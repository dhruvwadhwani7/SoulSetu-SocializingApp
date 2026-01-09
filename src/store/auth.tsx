import { useMyProfile } from "@/api/my-profile";
import { supabase } from "@/lib/supabase";
import { useConnection } from "@sendbird/uikit-react-native";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { disconnect, connect } = useConnection();
  const { data: profile } = useMyProfile();

  // Guard refs to ensure connect() is called exactly once per session
  const connectedRef = useRef(false);
  const connectingRef = useRef(false);

  // Handle Sendbird connection when user is authenticated and profile is loaded
  useEffect(() => {
    if (!session || !profile) {
      return;
    }

    // Prevent parallel connect attempts
    if (connectingRef.current || connectedRef.current) {
      return;
    }

    connectingRef.current = true;

    connect(profile.id, { nickname: profile.first_name || undefined })
      .then(() => {
        connectedRef.current = true;
        connectingRef.current = false;
      })
      .catch(() => {
        connectingRef.current = false;
      });
  }, [session, profile, connect]);

  // Handle auth state changes and logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // Reset connection guards on logout
        connectedRef.current = false;
        connectingRef.current = false;
        disconnect();
      }
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [disconnect]);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
