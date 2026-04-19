import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/theme.slice";

export function useTheme() {
   const mode = useAppSelector((state) => state.theme.mode);
   const dispatch = useAppDispatch();

   const toggle = () => dispatch(toggleTheme());

   return { mode, toggle };
}
