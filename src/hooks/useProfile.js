import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export const useProfile = (userId) => {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			return;
		}

		let mounted = true;

		const fetchProfile = async () => {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (!mounted) return;

			if (error && error.code !== "PGRST116") {
				setError("Failed to load profile.");
			} else {
				setProfile(data);
			}

			setLoading(false);
		};

		fetchProfile();

		return () => {
			mounted = false;
		};
	}, [userId]);

	const updateProfile = useCallback(
		async ({ username, avatarFile }) => {
			let avatar_url = profile?.avatar_url;

			if (avatarFile) {
				const fileExt = avatarFile.name.split(".").pop();
				const filePath = `${userId}/avatar.${fileExt}`;

				const { error: uploadError } = await supabase.storage
					.from("avatars")
					.upload(filePath, avatarFile, { upsert: true });

				if (uploadError) {
					return { error: uploadError };
				}

				const { data: urlData } = supabase.storage
					.from("avatars")
					.getPublicUrl(filePath);

				avatar_url = `${urlData.publicUrl}?t=${Date.now()}`;
			}

			const { data, error } = await supabase
				.from("profiles")
				.upsert({ id: userId, username, avatar_url })
				.select()
				.single();

			if (!error) setProfile(data);
			return { error };
		},
		[userId, profile?.avatar_url],
	);

	return { profile, loading, error, updateProfile };
};
