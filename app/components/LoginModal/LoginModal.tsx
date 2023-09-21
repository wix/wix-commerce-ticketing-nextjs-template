'use client';

import React, { useEffect } from 'react';
import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import { useUI } from '@app/components/Provider/context';
import { useWixClient } from '@app/hooks/useWixClient';
import Cookies from 'js-cookie';
import { WIX_REFRESH_TOKEN } from '@app/constants';
import { LoginState } from '@wix/sdk';
// @ts-ignore
import ReCAPTCHA from 'react-google-recaptcha-enterprise';

enum State {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  RESET_PASSWORD = 'RESET_PASSWORD',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

export const LoginModal = () => {
  const { closeModalLogin, displayLoginModal } = useUI();
  const [loading, setLoading] = React.useState(false);
  const wixClient = useWixClient();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [state, setState] = React.useState(State.LOGIN);
  const [pending, setPending] = React.useState({ state: false, message: '' });
  const [passwordInvalid, setPasswordInvalid] = React.useState(false);
  const [emailInvalid, setEmailInvalid] = React.useState(false);
  const [captcha, setCaptcha] = React.useState('');

  const captchaRef = React.useRef<ReCAPTCHA>(null);

  const closeModal = () => {
    setState(State.LOGIN);
    resetState();
    closeModalLogin();
  };

  const resetState = () => {
    setLoading(false);
    setPending({ state: false, message: '' });
    setEmail('');
    setCode('');
    setPasswordInvalid(false);
    setEmailInvalid(false);
    setUsername('');
    setPassword('');
  };

  useEffect(() => {
    resetState();
    captchaRef.current?.reset();
  }, [state]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let response;

    if (state === State.RESET_PASSWORD) {
      await wixClient.auth.sendPasswordResetEmail(
        email,
        window.location.origin
      );
      setPending({ message: 'Password reset email sent', state: true });
      return;
    }

    if (state === State.EMAIL_VERIFICATION) {
      response = await wixClient.auth.processVerification({
        verificationCode: code,
      });
    } else if (state === State.LOGIN) {
      response = await wixClient.auth.login({
        email,
        password,
      });
    } else {
      response = await wixClient.auth.register({
        email,
        password,
        captchaTokens: { recaptchaToken: captcha },
        profile: { nickname: username },
      });
    }

    if (response.loginState === LoginState.SUCCESS) {
      const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
        response.data.sessionToken!
      );
      Cookies.set(WIX_REFRESH_TOKEN, JSON.stringify(tokens.refreshToken), {
        expires: 2,
      });
      wixClient.auth.setTokens(tokens);
      closeModal();
      return;
    }

    if (response.loginState === LoginState.OWNER_APPROVAL_REQUIRED) {
      setPending({ message: 'Your account is pending approval', state: true });
    } else if (response.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
      setState(State.EMAIL_VERIFICATION);
    } else if (response.loginState === LoginState.FAILURE) {
      if (response.errorCode === 'invalidPassword') {
        setPasswordInvalid(true);
      } else if (
        response.errorCode === 'invalidEmail' ||
        response.errorCode === 'emailAlreadyExists'
      ) {
        setEmailInvalid(true);
      } else if (response.errorCode === 'resetPassword') {
        setPending({
          message: 'Your password requires reset',
          state: true,
        });
      }
    }
    captchaRef.current?.reset();
    setLoading(false);
  };

  const stateTitle =
    state === State.RESET_PASSWORD
      ? 'Reset Password'
      : state === State.LOGIN
      ? 'Log In'
      : state === State.EMAIL_VERIFICATION
      ? 'Email Verification'
      : 'Sign Up';

  const stateSubmit =
    state === State.RESET_PASSWORD
      ? 'Reset'
      : state === State.LOGIN
      ? 'Log In'
      : state === State.EMAIL_VERIFICATION
      ? 'Submit'
      : 'Sign Up';

  return (
    <React.Fragment>
      <Modal
        show={displayLoginModal}
        onClose={closeModal}
        root={globalThis.document?.body}
      >
        <Modal.Body>
          <form onSubmit={(e) => submit(e)}>
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
              <div className="flex">
                <h3 className="text-xl font-bold text-gray-900 text-center flex-1">
                  {stateTitle}
                </h3>
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 ml-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              {pending.state ? (
                <div>
                  <p className="pb-4">{pending.message}</p>
                  <Button onClick={closeModal}>OK</Button>
                </div>
              ) : (
                <>
                  {state === State.SIGNUP ? (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="username" value="Username" />
                      </div>
                      <TextInput
                        id="username"
                        type="text"
                        value={username}
                        color="primary"
                        required={true}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  ) : null}
                  {state !== State.EMAIL_VERIFICATION ? (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="email" value="Email" />
                      </div>
                      <TextInput
                        id="email"
                        type="email"
                        color={emailInvalid ? 'failure' : 'primary'}
                        helperText={emailInvalid ? 'Invalid email' : null}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailInvalid(false);
                        }}
                        required={true}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="code" value="Code" />
                      </div>
                      <TextInput
                        id="code"
                        type="number"
                        color="primary"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                        }}
                        required={true}
                      />
                    </div>
                  )}
                  {state !== State.RESET_PASSWORD &&
                  state !== State.EMAIL_VERIFICATION ? (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="password" value="Password" />
                      </div>
                      <TextInput
                        id="password"
                        type="password"
                        value={password}
                        required={true}
                        color={passwordInvalid ? 'failure' : 'primary'}
                        helperText={passwordInvalid ? 'Invalid password' : null}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordInvalid(false);
                        }}
                      />
                    </div>
                  ) : null}
                  {state === State.LOGIN ? (
                    <>
                      <div className="flex justify-between">
                        <a
                          onClick={() => setState(State.RESET_PASSWORD)}
                          className="text-sm text-blue-700 hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </>
                  ) : null}
                  {state === State.SIGNUP ? (
                    <ReCAPTCHA
                      size="normal"
                      ref={captchaRef}
                      sitekey={wixClient.auth.captchaVisibleSiteKey}
                      onChange={setCaptcha}
                    />
                  ) : null}
                  <div className="w-full">
                    <Button
                      type="submit"
                      disabled={
                        (!email && state !== State.EMAIL_VERIFICATION) ||
                        (!password &&
                          state !== State.RESET_PASSWORD &&
                          state !== State.EMAIL_VERIFICATION) ||
                        loading
                      }
                    >
                      {loading ? <Spinner aria-label="Loading" /> : stateSubmit}
                    </Button>
                  </div>
                  {state !== State.RESET_PASSWORD &&
                  state !== State.EMAIL_VERIFICATION ? (
                    <div className="text-sm font-medium text-gray-500">
                      {state === State.LOGIN ? 'Not' : ''} registered?{' '}
                      <a
                        onClick={() =>
                          setState(
                            state === State.LOGIN ? State.SIGNUP : State.LOGIN
                          )
                        }
                        className="text-blue-700 hover:underline"
                      >
                        {state === State.LOGIN ? 'Sign up' : 'Log in'}
                      </a>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};
