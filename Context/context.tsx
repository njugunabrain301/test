"use client";
import { MUIThemes } from "@/utils/Themes/Themes";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material";
import { verifyAuth } from "@/utils/frontendAPIs/auth";
import { pushEvent } from "@/utils/gtag";
import { addToCart } from "@/utils/frontendAPIs/cart";

// Define the context type
interface GlobalContextType {
  authUnVerified: boolean;
  verify: () => Promise<void>;
  cart: any[];
  openCart: boolean;
  handleOpenCart: () => void;
  handleCloseCart: () => void;
  totalPrice: number;
  totalCount: number;
  setCart: (cart: any[]) => void;
  openAuth: boolean;
  setOpenAuth: (open: boolean) => void;
  handleOpenAuth: () => void;
  handleCloseAuth: () => void;
  profile: any;
  addToLocalCart: (item: any) => void;
  addToCart: (item: any) => Promise<any>;
  removeFromLocalCart: (item: any) => void;
  theme: any;
  titleFont: any;
  bodyFont: any;
  subtitleFont: any;
  checkoutInfo: any;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  miniHeader: boolean;
  setMiniHeader: (mini: boolean) => void;
}

// Create context with proper typing
const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

interface GlobalContextProviderProps {
  children: ReactNode;
  profile: any;
  titleFont: any;
  bodyFont: any;
  subtitleFont: any;
  checkoutInfo: any;
}

export const GlobalContextProvider = ({
  children,
  profile,
  titleFont,
  bodyFont,
  subtitleFont,
  checkoutInfo,
}: GlobalContextProviderProps) => {
  //Cart Operations
  const [cart, setCart] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const setCartMod = (cart: any[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setCart(cart);
  };
  useEffect(() => {
    let tP = 0;
    let tC = 0;
    cart.map((item) => {
      tP += item.price * item.amount;
      tC += item.amount;
      return item;
    });
    setTotalCount(tC);
    setTotalPrice(tP);
  }, [cart]);

  //Auth Modal
  const [openAuth, setOpenAuth] = useState(false);
  const handleOpenAuth = () => {
    console.log("handleOpenAuth");
    setOpenAuth(true);
  };
  const handleCloseAuth = () => {
    setOpenAuth(false);
  };
  const theme = MUIThemes[profile.theme.toLowerCase()];
  // const theme = MUIThemes["dawn"];

  const [miniHeader, setMiniHeader] = useState(false);

  const addToLocalCart = (item: any) => {
    let found = false;
    let nCart = cart.map((it) => {
      if (
        it._id === item._id &&
        it.color === item.color &&
        it.size === item.size &&
        it.selectedOption === item.selectedOption
      ) {
        found = true;
        it.amount++;
      }
      return it;
    });
    if (!found) {
      nCart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(nCart));
    setCart(nCart);
  };

  const removeFromLocalCart = (item: any) => {
    let nCart = cart.map((it) => {
      if (
        it._id === item._id &&
        it.color === item.color &&
        it.size === item.size &&
        it.selectedOption === item.selectedOption
      ) {
        it.amount--;
      }
      return it;
    });
    nCart = nCart.filter((it) => it.amount > 0);

    localStorage.setItem("cart", JSON.stringify(nCart));
    setCart(nCart);
  };

  useEffect(() => {
    if (localStorage.getItem("cart"))
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  //Cart Modal
  const [openCart, setOpenCart] = useState(false);
  const handleOpenCart = () => {
    let cartTotal = 0;
    cart.map((itm) => {
      cartTotal += itm.price * itm.amount;
    });
    let event = {
      event: "view_cart",
      currency: "KES",
      value: cartTotal,
      items: cart.map((item, idx) => {
        return {
          item_id: item._id,
          item_name: item.name,
          affiliation: profile.name,
          coupon: "",
          discount: 0,
          index: idx,
          item_brand: item.brand,
          item_category: "",
          item_category2: "",
          item_variant:
            item.color + " " + item.size + " " + item.selectedOption,
          price: item.price,
          quantity: item.amount,
        };
      }),
    };
    let dataLayer = window.dataLayer || [];
    dataLayer.push(event);
    pushEvent("event", "view_cart", event);
    setOpenCart(true);
  };
  const handleCloseCart = () => {
    setOpenCart(false);
  };
  const [isVisible, setIsVisible] = useState(false);

  //Verify Auth
  const [authUnVerified, setAuthUnVerified] = useState(false);
  const verify = async () => {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      let res = await verifyAuth();

      if (!res.success) {
        setAuthUnVerified(true);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        setCart([]);
      }
    }
  };
  return (
    <div
      style={{
        backgroundColor: theme.customPalette.background.primary,
        color: theme.customPalette.text.base,
      }}
    >
      <ThemeProvider theme={theme}>
        <GlobalContext.Provider
          value={{
            authUnVerified,
            verify,
            cart,
            openCart,
            handleOpenCart,
            handleCloseCart,
            totalPrice,
            totalCount,
            setCart: setCartMod,
            openAuth,
            setOpenAuth,
            handleOpenAuth,
            handleCloseAuth,
            profile,
            addToLocalCart,
            addToCart,
            removeFromLocalCart,
            theme: theme,
            titleFont,
            bodyFont,
            subtitleFont,
            checkoutInfo,
            isVisible,
            setIsVisible,
            miniHeader,
            setMiniHeader,
          }}
        >
          {children}
        </GlobalContext.Provider>
      </ThemeProvider>
    </div>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
