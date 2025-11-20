import { interviewCovers, mappings } from "@/constants";

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ");
}

const normalizeTechName = (tech) => {
  return tech
    .toLowerCase()
    .replace(/\.js$/, "")
    .replace(/\s+/g, "");
};

const checkIconExists = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    const mapped = mappings[normalized] || normalized;

    return {
      tech,
      url: `${techIconBaseURL}/${mapped}/${mapped}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => {
      const exists = await checkIconExists(url);

      return {
        tech,
        url: exists ? url : "/tech.svg",
      };
    })
  );

  return results;
};

// Random cover picker
export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};