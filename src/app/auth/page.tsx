'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { Input } from '@/components/common/input';
import { fetchUser } from '@/apis/github';
import { database } from '@/utils/database';

const ERROR_MESSAGE: Record<number, string> = {
  401: 'It is not a valid token.',
};

export default function Auth() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setMessage('');
    try {
      await fetchUser(inputValue);

      await database.updateFieldValue('token.github', inputValue);

      router.replace('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        const { status } = error.response || { status: 599 };
        setMessage(ERROR_MESSAGE[status] || error.message);
      }
    }
  };

  return (
    <div className='flex flex-1 justify-center'>
      <div className="my-28">
          <div className="mb-24">
            <Image
              src="/assets/logo.png"
              alt="Duroot Logo"
              width={240}
              height={80}
              unoptimized
              style={{ margin: '0 auto' }}
            />
          </div>
          <div className='flex'>
            <div className="mr-2">
              <Input
                placeholder="Please enter your token"
                value={inputValue}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                onChange={(event) => setInputValue(event.target.value)}
              />
              {!!message && (
                <p className="ml-1 mt-2 text-xs text-[#e5534b]">{message}</p>
              )}
            </div>
            <button
              className="bg-[#347d39] hover:bg-[#46954a] text-[#ffffff] text-sm rounded h-[32px] px-4 border border-[rgba(205,217,229,0.1)]"
              onClick={handleSubmit}
              disabled={!inputValue}
            >
              Submit
            </button>
          </div>
        </div>
    </div>
  );
}
