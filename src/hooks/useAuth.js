import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		supabase.auth.getSession().then(({ data: { session }, error }) => {
			if (!mounted) return;
			if (error) console.error("Auth session error:", error.message);
			setSession(session);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!mounted) return;
			setSession(session);
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	return { session, loading };
};
