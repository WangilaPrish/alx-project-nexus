export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experienceLevel: string;
  description?: string;
  applyLink?: string;
  salary?: string;
  postedAt?: string;
}
