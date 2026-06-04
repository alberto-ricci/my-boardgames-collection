import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("useAuth running");
		supabase.auth.getSession().then(({ data: { session } }) => {
			console.log("session resolved", session);
			setSession(session);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	return { session, loading };
};
