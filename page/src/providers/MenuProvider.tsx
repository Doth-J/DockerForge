import React, { ReactNode, createContext, useContext, useState } from "react";

export const MenuContext = createContext<
  [string, React.Dispatch<string>] | undefined
>(undefined);

export function useMenu() {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error("useMenu must be used within a MenuProvider");
  return menu;
}

export default function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<string>("intro");

  return (
    <MenuContext.Provider value={[menu, setMenu]}>
      {children}
    </MenuContext.Provider>
  );
}
