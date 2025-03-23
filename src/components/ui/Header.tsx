import Image from "next/image";
import { Button } from "./button";
import Searchbar from "./Searchbar";
import { logout } from "@/actions";
import FileUploader from "./FileUploader";

type HeaderProps = {
  userId: string;
  accountId: string;
};

const Header: React.FC<HeaderProps> = ({ userId, accountId }) => {
  console.log(accountId, "account id in header");
  return (
    <header className="hidden items-center justify-between gap-5 sm:flex xl:gap-10">
      <Searchbar />
      <div className="flex-center flex min-w-fit gap-4">
        <FileUploader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            "use server";

            await logout();
          }}
        >
          <Button
            type="submit"
            className="flex-center bg-brand/10 text-brand hover:bg-brand/20 h-[52px] min-w-[54px] items-center rounded-full p-0 shadow-none transition-all"
          >
            <Image src="/assets/icons/logout.svg" alt="logo" width={24} height={24} className="w-6" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
