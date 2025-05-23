import { helix } from "ldrs";
import { dotSpinner } from "ldrs";
import { bouncy } from "ldrs";
import { lineWobble } from "ldrs";

helix.register();
dotSpinner.register();
bouncy.register();
lineWobble.register();


function BufferLoader({ isLoading }) {
  return (
    <div className="mt-2 " aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <l-dot-spinner size="40" speed="0.9" color="black"></l-dot-spinner>
      )}
    </div>
  );
}
export default BufferLoader