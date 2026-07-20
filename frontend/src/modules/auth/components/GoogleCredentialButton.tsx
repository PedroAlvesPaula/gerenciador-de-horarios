import { useEffect, useRef } from "react";
import {
  type CredentialResponse,
  type GsiButtonConfiguration,
  type IdConfiguration,
  useGoogleOAuth,
} from "@react-oauth/google";
import CircularProgress from "@mui/material/CircularProgress";

interface GoogleIdentityApi {
  initialize: (configuration: IdConfiguration) => void;
  renderButton: (
    parent: HTMLElement,
    configuration: GsiButtonConfiguration,
  ) => void;
}

type WindowWithGoogleIdentity = Window & {
  google?: {
    accounts?: {
      id?: GoogleIdentityApi;
    };
  };
};

interface GoogleCredentialButtonProps {
  onSuccess: (credential: string) => void | Promise<void>;
  onError: () => void;
}

let initializedClientId: string | null = null;
let activeCredentialHandler:
  | ((response: CredentialResponse) => void)
  | null = null;

const dispatchCredential = (response: CredentialResponse): void => {
  activeCredentialHandler?.(response);
};

const GoogleCredentialButton = ({
  onSuccess,
  onError,
}: GoogleCredentialButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();

  useEffect(() => {
    const container = containerRef.current;
    if (!scriptLoadedSuccessfully || !container) return;

    const googleIdentity = (window as WindowWithGoogleIdentity).google?.accounts
      ?.id;

    if (!googleIdentity) {
      onError();
      return;
    }

    const handleCredential = (response: CredentialResponse): void => {
      if (!response.credential) {
        onError();
        return;
      }

      void onSuccess(response.credential);
    };

    activeCredentialHandler = handleCredential;

    if (initializedClientId === null) {
      googleIdentity.initialize({
        client_id: clientId,
        callback: dispatchCredential,
      });
      initializedClientId = clientId;
    } else if (initializedClientId !== clientId) {
      onError();
      return;
    }

    container.replaceChildren();
    googleIdentity.renderButton(container, {
      type: "standard",
      size: "large",
      text: "signin_with",
      theme: "outline",
      locale: "pt-BR",
      width: 320,
    });

    return () => {
      container.replaceChildren();

      if (activeCredentialHandler === handleCredential) {
        activeCredentialHandler = null;
      }
    };
  }, [clientId, onError, onSuccess, scriptLoadedSuccessfully]);

  if (!scriptLoadedSuccessfully) {
    return <CircularProgress size={24} />;
  }

  return <div ref={containerRef} />;
};

export default GoogleCredentialButton;
