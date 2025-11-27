import type { User } from "@supabase/supabase-js";
import type { Profile } from "./profile";

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    signOut: () => Promise<void>;
    loading: boolean;
}
