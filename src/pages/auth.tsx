import { createSignal, Show } from 'solid-js';
import axios, { AxiosError } from 'axios';
import Button from '../components/Button';

const ERROR_MESSAGE: Record<number, string> = {
  401: '올바른 토큰이 아닙니다.',
};

interface AuthProps {
  onSubmit?: (token: string) => void;
}

function Auth(props: AuthProps) {
  const [token, setToken] = createSignal('');
  const [message, setMessage] = createSignal('');

  const handleSubmit = async () => {
    try {
      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token()}`,
          // 'X-GitHub-Api-Version': '2022-11-28',
        }
      });

      console.log(data);
      
      props.onSubmit?.(token());
    } catch (err) {
      const error = err as AxiosError;
      const { status } = error.response || { status: 599 };
      
      setMessage(ERROR_MESSAGE[status] || error.message);
    }
  };
  return (
    <div class='flex flex-1 justify-center'>
      <div class="my-32">
        <div class="mb-24">
          <h1 class="text-4xl text-center">Duroot</h1>
        </div>
        <div class='flex'>
          <div class="mr-2">
            <input
              type='text'
              class="bg-white text-[#0f0f0f] px-2 py-1 rounded-sm"
              value={token()}
              onInput={(e) => {
                setMessage('');
                setToken(e.currentTarget.value);
              }}
            />
            <Show when={!!message()}>
              <p class="mt-2 text-xs">
                {message()}
              </p>
            </Show>
          </div>
          <button
            class="bg-[#0f0f0f98] rounded h-[32px] px-4"
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
