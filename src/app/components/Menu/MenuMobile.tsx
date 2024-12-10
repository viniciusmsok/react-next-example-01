"use client"
import React, { JSX, useState } from "react";

import Avatar from "./Avatar";
import { MenuItem, MenuItems } from "./MenuItems.const";

export default function MenuMobile() {
  const [showMenu, setShowMenu] =  useState<boolean>(false);
  const [menuList, setMenuList] =  useState<MenuItem[]>(MenuItems);

  const toggleMenuItem = (toggledItemId: string) => {
    const _updateItem = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => ({
        ...item,
        isOpened: item.id === toggledItemId ? !item.isOpened : item.isOpened,
        subMenu: item.subMenu ? _updateItem(item.subMenu) : undefined
      }));
    }

    setMenuList(_updateItem(menuList));
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

  const getMenuStyle = (itemLevel: number) => {
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

  const renderMenu = (nodeMenu: MenuItem[]): JSX.Element[] => {
    const _renderCaption = (item: MenuItem) => {
      const caption: JSX.Element[] = [];

      if (item.subMenu?.length) {
        if (item.isOpened) {
          caption.push(
            <div key={`mobile_open${item.id}`} className="text-sm w-[20px] items-center justify-center">▼</div>);
        }
        else {
          caption.push(<div key={`mobile_close${item.id}`} className="text-sm w-[20px] items-center justify-center">▶</div>);
        }
      }
      else {
        caption.push(<div key={`mobile_none${item.id}`} className="text-sm w-[20px]">&nbsp;</div>);
      }

      caption.push(<div key={`mobile_caption${item.id}`} className="flex-1">{item.caption}</div>)

      return caption;
    }

    return nodeMenu.flatMap((item) => {
      let onClickEvent = undefined;

      if (item.onClick) {
        onClickEvent = () => {
          if (item.onClick) {
            item.onClick();
          }
          closeAllSubItems(menuList, true);
          setShowMenu(false);
        }
      } else if (item.subMenu?.length) {
        onClickEvent = () => toggleMenuItem(item.id);
      }

      return [
        <a
          href={item.link || '#'}
          key={`mobile_a_link_${item.id}`}
          onClick={onClickEvent}
          className={getMenuStyle(item.level)}>
            { _renderCaption(item) }
        </a>,
        ...(item.isOpened && item.subMenu ? renderMenu(item.subMenu) : [])
      ]
    });
  }

  const renderMenuOptions = () => {
    if (!showMenu) {
      return null;
    }

    return (
      <div>
        <div className="px-2 pt-2 pd-3 sm:px-3">
          { renderMenu(menuList) }
        </div>
      </div>
    )
  }

  const renderMenuButton = () => {
    return (
      <div className="mr-2 flex">
        <button
          id="botao"
          type="button"
          className={ getMenuButtonStyle() }
          aria-label="Menu"
          aria-expanded="false"
          onClick={
            () => {
              const show = !showMenu;
              if (!show) {
                closeAllSubItems(menuList, true);
              }

              setShowMenu(show);
            }
          }>

          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 md:hidden">
      <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Avatar/>
          </div>

          { renderMenuButton() }

        </div>

      </div>

      { renderMenuOptions() }

    </div>
  );
}
