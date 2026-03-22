import { createContext, useContext } from "react";

const Ctx = createContext<any>(null);

const useApp = () => useContext(Ctx);

export { Ctx, useApp };
