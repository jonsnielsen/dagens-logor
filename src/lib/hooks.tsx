import { usePathname } from "next/navigation";

/**
 *
 * @param entry the entry. 0 would be the root. Right now only entry 1 is supported
 * @returns
 */
export function usePathnameEntry(entryNumber: number) {
  const pathname = usePathname();
  const pathnameArray = pathname.split("/");
  // first entry will be empty string, for our purposes the second entry is the first
  const entry =
    pathnameArray.length >= entryNumber + 1 && pathnameArray[entryNumber];
  console.log({ entry });
  return entry;
}
