import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-soft px-4">
      <div className="mb-8">
        <Image
          src="/images/goal_blk.png"
          alt="GOAL Platform"
          width={140}
          height={45}
          className="h-10 w-auto dark:hidden"
          priority
        />
        <Image
          src="/images/goal_wht.png"
          alt="GOAL Platform"
          width={140}
          height={45}
          className="hidden h-10 w-auto dark:block"
          priority
        />
      </div>
      {children}
    </div>
  );
}
