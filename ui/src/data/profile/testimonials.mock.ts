import { initialState } from "@/types/avatar-builder/avatarConfig";
import { Testimonial } from "@/types/profile/testimonials.types";

export const defaultTestimonials: Testimonial[] = [
  {
    name: "Alex K.",
    role: "Werewolf Champion",
    content:
      "The most intense online werewolf experience I've had. The night phases are genuinely suspenseful!",
    avatarOptions: initialState,
  },
  {
    name: "Mira J.",
    role: "Village Elder",
    content:
      "I've been playing werewolf games for years, and this is the best implementation I've seen. The roles are perfectly balanced.",
    avatarOptions: initialState,
  },
  {
    name: "Carlos T.",
    role: "Strategy Gamer",
    content:
      "The social deduction elements shine in this version. I love how tense each vote becomes!",
    avatarOptions: initialState,
  },
];
