'use client';

import Link from "next/link";
import { useState } from "react";
import { Terminal, BookOpen, Plus, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transform transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-[0_0_15px_rgba(184,255,51,0.3)]">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            MD_Memo
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 md:space-x-4">
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/5 text-muted-foreground hover:text-foreground">
            <Link href="/">
              <BookOpen className="mr-2 h-4 w-4" />
              Library
            </Link>
          </Button>

          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                   <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                     <User className="h-4 w-4" />
                   </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/5 text-muted-foreground hover:text-foreground">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}

          <Button size="sm" asChild className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(184,255,51,0.2)] hover:shadow-[0_0_20px_rgba(184,255,51,0.4)] transition-all">
            <Link href="/cards/new">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl absolute w-full left-0 animate-in slide-in-from-top-5 fade-in duration-200">
           <nav className="flex flex-col p-4 space-y-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Library</span>
              </Link>

              {user ? (
                <button
                  onClick={handleSignOut}
                   className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-destructive transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log out ({user.email})</span>
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Login</span>
                </Link>
              )}

              <Link 
                href="/cards/new"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(184,255,51,0.2)]">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Card
                </Button>
              </Link>
           </nav>
        </div>
      )}
    </header>
  );
}
