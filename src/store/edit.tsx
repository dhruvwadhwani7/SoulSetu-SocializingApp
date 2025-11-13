import { useMyProfile } from "@/api/my-profile";
import { PrivateProfile } from "@/api/my-profile/types";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type EditContextType = {
  edits: PrivateProfile | null;
  setEdits: (profile: PrivateProfile | null) => void;
  gridActive: boolean;
  setGridActive: (active: boolean) => void;
};

const EditContext = createContext<EditContextType>({
  edits: null,
  setEdits: () => {},
  gridActive: false,
  setGridActive: () => {},
});

export const EditProvider = ({ children }: PropsWithChildren) => {
  const { data: myProfile } = useMyProfile();
  const [edits, setEdits] = useState<PrivateProfile | null>(myProfile);
  const [gridActive, setGridActive] = useState(false);

  useEffect(() => {
    setEdits(myProfile);
  }, [myProfile]);

  return (
    <EditContext.Provider
      value={{
        edits: edits,
        setEdits: setEdits,
        gridActive,
        setGridActive,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error("useEdit must be used within a EditProvider");
  }
  return context;
};