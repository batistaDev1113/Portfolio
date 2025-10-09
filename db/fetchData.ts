import projectsData from "../data/projects.json";

// Local project data
export const revalidate = 1;

export async function fetchData() {
  try {
    // Return local projects data
    return projectsData;
  } catch (error) {
    console.error("Failed to load local project data:", error);
    // Return empty array as fallback to prevent app crash
    return [];
  }
}
