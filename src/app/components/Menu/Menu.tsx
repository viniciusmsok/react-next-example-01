"use client"
import React, { JSX, useState, useRef } from "react";
import { MenuItem, MenuItems } from "./MenuItems.const";
import Image from "next/image";
import ClickOutside from "@/app/components/ClickOutside/ClickOutside";

export default function Menu() {
  const [showMobileMenu, setShowMobileMenu] =  useState<boolean>(false);
  const [menuList, setMenuList] =  useState<MenuItem[]>(MenuItems);

  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [activeLargeMenuId, setActiveLargeMenuId] = useState<string | null>(null);
  const [largeMenuPosition, setLargeMenuPosition] = useState({ left: 0, top: 0 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleOutsideClick = () => {
    setActiveLargeMenuId(null);
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const toggleMobileMenuItem = (toggledItemId: string) => {
    const updateItem = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => ({
        ...item,
        isOpened: item.id === toggledItemId ? !item.isOpened : item.isOpened,
        subMenu: item.subMenu ? updateItem(item.subMenu) : undefined
      }));
    }

    setMenuList(updateItem(menuList));
  };

  const closeAllSubItems = (list: MenuItem[], isRoot: boolean) => {
    list.forEach((el: MenuItem) => {
      el.isOpened = false;
      if (el.subMenu) {
        closeAllSubItems(el.subMenu, false);
      }
    });

    if (isRoot) {
      setMenuList(list);
    }
  }

  const renderAvatar = () => {
    return (
      <a href="#" className="flex-shrink-0">
        <Image className="h-8 w-8 rounded-full" src="/photo.png" alt="Vinícius de Moraes" width="32" height="32"/>
      </a>
    );
  }

  const getMenuMobileStyle = (itemLevel: number) => {
    const result = [
      'flex',
      'text-white block',
      'px-3',
      'py-2',
      'rounded-md',
      'text-base',
      'font-medium',
      'transition',
      'duration-300',
      'ease-in-out'
    ]

    switch(itemLevel) {
      case 3: {
        result.push('bg-gray-400');
        result.push('hover:bg-gray-500');
        break;
      }

      case 2: {
        result.push('bg-gray-600');
        result.push('hover:bg-gray-700');
        break;
      }

      case 1: {
        result.push('bg-gray-800');
        result.push('hover:bg-gray-900');
        break;
      }
    }

    return result.join(' ');
  }

  const getMenuLargeStyle = () => {
    return [
      'hover:bg-gray-700',
      'text-white',
      'px-3',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'transition',
      'duration-300',
      'ease-in-out'
    ].join(' ');
  }

  const getMenuButtonStyle = () => {
    return [
      'inline-flex',
      'items-center',
      'justify-center',
      'p-2',
      'rounded-md',
      'text-gray-400',
      'hover:text-white',
      'hover:bg-gray-700',
      'focus:outline-none',
      'focus:bg-gray-700',
      'focus:text-white',
      'transition',
      'duration-300',
      'ease-in-out'
    ].join(' ');
  }

  const renderMenuMobile = (_menu: MenuItem[]): JSX.Element[] => {
    const getCaption = (item: MenuItem) => {
      const caption: JSX.Element[] = [];

      if (item.subMenu?.length) {
        if (item.isOpened) {
          caption.push(<div key={`open${item.id}`} className="text-sm w-[20px] items-center justify-center">▼</div>);
        }
        else {
          caption.push(<div key={`close${item.id}`} className="text-sm w-[20px] items-center justify-center">▶</div>);
        }
      }
      else {
        caption.push(<div key={`none${item.id}`} className="text-sm w-[20px]">&nbsp;</div>);
      }

      caption.push(<div key={`caption${item.id}`} className="flex-1">{item.caption}</div>)

      return caption;
    }

    return _menu.flatMap((item) => {
      let onClickEvent = undefined;

      if (item.onClick) {
        onClickEvent = () => {
          if (item.onClick) {
            item.onClick();
          }
          closeAllSubItems(menuList, true);
          setShowMobileMenu(false);
        }
      } else if (item.subMenu?.length) {
        onClickEvent = () => toggleMobileMenuItem(item.id);
      }

      return [
        <a
          href={item.link || '#'}
          key={item.id}
          onClick={onClickEvent}
          className={getMenuMobileStyle(item.level)}>
            { getCaption(item) }
        </a>,
        ...(item.isOpened && item.subMenu ? renderMenuMobile(item.subMenu) : [])
      ]
    });
  }

  const renderMobileMenuOptions = () => {
    if (!showMobileMenu) {
      return null;
    }

    return (
      <div className="md:hidden">
        <div className="px-2 pt-2 pd-3 sm:px-3">
          { renderMenuMobile(menuList) }
        </div>
      </div>
    )
  }

  const renderMobileMenuButton = () => {
    return (
      <div className="mr-2 flex md:hidden">
        <button
          id="botao"
          type="button"
          className={ getMenuButtonStyle() }
          aria-label="Menu"
          aria-expanded="false"
          onClick={
            () => {
              const show = !showMobileMenu;
              if (!show) {
                closeAllSubItems(menuList, true);
              }

              setShowMobileMenu(show);
            }
          }>

          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    );
  }

  const showFloatingSubMenu = (id: string) => {
    if (id === activeLargeMenuId) {
      setActiveLargeMenuId(null);
      return;
    }

    if (linkRef.current) {    
      setLargeMenuPosition({
        left: mousePosition.x + 20,
        top: mousePosition.y
      });
    }

    setActiveLargeMenuId(id);
  }

  const renderLargeMainMenu = () => {
    return (
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-4 text-white">
          {
            menuList.flatMap((item) => {
              let onClickEvent = undefined;

              if (item.onClick) {
                onClickEvent = () => {
                  if (item.onClick) {
                    item.onClick();
                  }
                  closeAllSubItems(menuList, true);
                  setShowMobileMenu(false);
                }
              } else if (item.subMenu?.length) {
                onClickEvent = () => showFloatingSubMenu(item.id);
              }

              return (
                <a
                  ref={linkRef}
                  href={item.link || '#'}
                  key={item.id}
                  onClick={onClickEvent}
                  className={getMenuLargeStyle()}>
                    <span>{item.caption}</span>
                </a>
              );
            })
          }
        </div>
      </div>
    );
  }

  const renderLargeMenuOptions = () => {
    if (!activeLargeMenuId) {
      return <></>;
    }

    return (
      <div
        style={{ left: largeMenuPosition.left, top: largeMenuPosition.top }}
        className="absolute bg-white border rounded-md shadow-md z-10 mt-2">
        <ul className="py-2">
          <li className="px-4 py-2 hover:underline cursor-pointer">
            <button className="text-gray-600 hover:text-gray-900" onClick={() => { alert('teste'); }}>Teste1</button>
          </li>

          <li className="px-4 py-2 hover:underline cursor-pointer">
            <button className="text-gray-600 hover:text-gray-900" onClick={() => { alert('teste'); }}>Teste2</button>
          </li>

          <li className="px-4 py-2 hover:underline cursor-pointer">
            <button className="text-gray-600 hover:text-gray-900" onClick={() => { alert('teste'); }}>Teste3</button>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className="bg-gray-800">
      <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center" onMouseMove={handleMouseMove}>
            { renderAvatar() }
            { renderLargeMainMenu() }
          </div>

          { renderMobileMenuButton() }
        </div>
      </div>

      { renderMobileMenuOptions() }

      <ClickOutside onClickOutside={handleOutsideClick}>
        { renderLargeMenuOptions() }
      </ClickOutside>
    </div>
  );
}
