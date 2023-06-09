import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { AxiosError } from 'axios';
import Input from '../components/common/input';
import { createLocalStorageSignal } from '../hooks/create-local-storage-signal';
import { useAuthStore } from '../stores/auth';
import { fetchUser } from '../utils/github-api';
import logo from '../assets/logo.png';

const ERROR_MESSAGE: Record<number, string> = {
  401: '올바른 토큰이 아닙니다.',
};

function Auth() {
  const navigate = useNavigate();
  const [value, setValue] = createSignal('');
  const [message, setMessage] = createSignal('');
  const [, setLocalToken] = createLocalStorageSignal<{github: string}>('token');
  const [, setAuthStore] = useAuthStore();

  const handleSubmit = async () => {
    try {
      const token = value();
      if (!token) {
        return;
      }
      const user = await fetchUser(token);

      alert(`${user.login} 님 환영합니다!`);

      await setLocalToken(prevToken => ({
        ...prevToken,
        github: token,
      }));
      setAuthStore({
        id: user.id,
        login: user.login,
        token,
      });

      navigate('/pulls');
    } catch (err) {
      const error = err as AxiosError;
      const { status } = error.response || { status: 599 };
      
      setMessage(ERROR_MESSAGE[status] || error.message);
    }
  };

  return (
    <div class='flex flex-1 justify-center'>
      <div class="my-28">
        <div class="mb-24">
          <img src={logo} alt="logo" />
        </div>
        <div class='flex'>
          <div class="mr-2">
            <Input
              placeholder="Please enter your token"
              value={value()}
              onInput={(e) => {
                setMessage('');
                setValue(e.currentTarget.value);
              }}
            />
            <Show when={!!message()}>
              <p class="ml-1 mt-2 text-xs text-[#e5534b]">
                {message()}
              </p>
            </Show>
          </div>
          <button
            class="bg-[#347d39] hover:bg-[#46954a] text-[#ffffff] text-sm rounded h-[32px] px-4 border border-[rgba(205,217,229,0.1)]"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
