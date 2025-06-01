import { AvatarConfigType } from "../avatar-builder/avatarConfig";

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatarOptions: Record<keyof AvatarConfigType, number>;
}

export interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}
