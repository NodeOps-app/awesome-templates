import React from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showViewAll = false,
  viewAllLink = "/directory",
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-primary/10">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
            {title}
          </Link>
          {showViewAll && (
            <Link
              href={viewAllLink}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-medium transition-colors"
            >
              View Directory
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
