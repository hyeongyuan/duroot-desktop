import { createSignal } from 'solid-js';
import Button from '../components/Button';
import Input from '../components/Input';

interface AuthProps {
  onSubmit?: (token: string) => void;
}

function Auth({onSubmit}: AuthProps) {
  const [token, setToken] = createSignal('');

  const handleSubmit = () => {
    onSubmit?.(token());
  };
  return (
    <div class='flex flex-1 items-center justify-center'>
      <div>
        <Input
          type='text'
          value={token()} 
          onChange={(e) => setToken(e.currentTarget.value)}
        />
        <Button onClick={handleSubmit} label="등록" />
      </div>
    </div>
  )
}

export default Auth;
