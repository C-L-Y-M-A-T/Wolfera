"use client";

import { ProfilePage } from "@/app-pages/profile-page";
import { useParams } from "next/navigation";

export default function Profile() {
  const params = useParams();
  const id = params.id as string;
  return <ProfilePage id={id} />;
}
