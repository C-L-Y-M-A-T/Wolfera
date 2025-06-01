export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}
