import { createContext, useState, useContext } from 'react';
import { projectApi } from '../api/projectApi';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectApi.getAll();
      setProjects(res.data);
      // Auto-select first project if none active
      if (!activeProject && res.data.length > 0) {
        setActiveProject(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = async (id) => {
    try {
      const res = await projectApi.getOne(id);
      setActiveProject(res.data);
    } catch (err) {
      console.error('Failed to select project', err);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects, activeProject, loading,
      fetchProjects, selectProject, setActiveProject, setProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
};

export default ProjectContext;
