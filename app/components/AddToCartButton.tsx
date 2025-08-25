import {type FetcherWithComponents, useLocation} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Loader2, LoaderCircle, ShoppingBag} from "lucide-react";
import {useAside} from '~/components/Aside';
import {ReactNode, useEffect, useState} from 'react';
import {APP_STRINGS} from '~/common/constants/appStrings';
import {getAvailableLocaleFromPathname} from '~/common/utils/i18nUtils';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  const location = useLocation();
  const {open} = useAside();

  const [fetcherState, setFetcherState] = useState("idle");
  const [fetcherData, setFetcherData] = useState(null);

  useEffect(() => {
    if (fetcherState === "idle" && fetcherData) {
      open("cart");
    }
  }, [fetcherState, fetcherData, open]);

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        if (fetcher.state !== fetcherState) setFetcherState(fetcher.state);
        if (fetcher.data !== fetcherData) setFetcherData(fetcher.data);

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
              className={`
                relative overflow-hidden
                w-full py-3 flex justify-center items-center rounded-[6px]
                text-sm font-[600] font-main text-light-bg1
                bg-light-main border-2 border-light-main
                transition-all duration-300 ease-in-out
                hover:text-light-main
                before:absolute before:inset-0
                before:bg-light-bg1 before:translate-x-[-110%]
                before:transition-transform before:duration-500 before:ease-in-out
                hover:before:translate-x-0
              `}
            >
              {fetcher.state === "idle"
                ? <div className={"relative z-10"}>{children}</div>
                : (
                  <div className={"relative z-10 flex gap-3 items-center justify-center"}>
                    <LoaderCircle size={20} className={"animate-spin"}/>
                    <div className={""}>{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].loadingText}</div>
                  </div>
                )
              }
            </button>
          </>
        )
      }}
    </CartForm>
  );
}
