import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    await createProject({ name: projectName, description, startDate, endDate });

    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  // const isFormValid = () => {
  //   return projectName && description && startDate && endDate;
  // };

  const inputStyles = `w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form
          className="mt-4 space-y-6"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            className={inputStyles}
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <textarea
            className={inputStyles}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            className={inputStyles}
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <input
            type="text"
            className={inputStyles}
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </form>
      )}
    </Modal>
  );
};

export default ModalNewProject;
