import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useProfile = (userId) => {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) {
			setLoading(false); // add this
			return;
		}

		const fetchProfile = async () => {
			setLoading(true);
			const { data } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();
			setProfile(data);
			setLoading(false);
		};

		fetchProfile();
	}, [userId]);

	const updateProfile = async ({ username, avatarFile }) => {
		let avatar_url = profile?.avatar_url;

		if (avatarFile) {
			const fileExt = avatarFile.name.split(".").pop();
			const filePath = `${userId}/avatar.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from("avatars")
				.upload(filePath, avatarFile, { upsert: true });

			if (!uploadError) {
				const { data } = supabase.storage
					.from("avatars")
					.getPublicUrl(filePath);
				avatar_url = `${data.publicUrl}?t=${Date.now()}`;
			}
		}

		const { data, error } = await supabase
			.from("profiles")
			.upsert({ id: userId, username, avatar_url })
			.select()
			.single();

		if (!error) setProfile(data);
		return { error };
	};

	return { profile, loading, updateProfile };
};
