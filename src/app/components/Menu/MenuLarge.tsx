"use client"
import React, { JSX, useState } from "react";

import Avatar from "./Avatar";
import { MenuItem, MenuItems } from "./MenuItems.const";

import ClickOutside from "@/app/components/ClickOutside/ClickOutside";

export default function MenuLarge() {
  const [activeMainMenuId, setActiveMainMenuId] = useState<string | null>(null);
  const [mainMenuList, setMainMenuList] =  useState<MenuItem[]>(MenuItems);

  const [dropDownMenuList, setDropDownMenuList] =  useState<MenuItem[]>([]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dropDownMenuPosition, setDropDownMenuPosition] = useState({ left: 0, top: 0 });

  const closeAllSubItems = (list: MenuItem[], isRoot: boolean) => {
    list.forEach((el: MenuItem) => {
      el.isOpened = false;
      if (el.subMenu) {
        closeAllSubItems(el.subMenu, false);
      }
    });

    if (isRoot) {
      setMainMenuList(list);
    }
  }

  const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const toggleMenuItem = (toggledItemId: string) => {
    const updateItem = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        return {
        ...item,
        isOpened: item.id === toggledItemId ? !item.isOpened : item.isOpened,
        subMenu: item.subMenu ? updateItem(item.subMenu) : undefined
        }
      });
    }

    setMainMenuList(updateItem(mainMenuList));

    const root = mainMenuList.find((el) => el.id === activeMainMenuId);
    if (root?.subMenu?.length) {
      setDropDownMenuList(root.subMenu);
    }
    else {
      setDropDownMenuList([]);
    }
  };

  const getMenuStyle = () => {
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

  const showFloatingSubMenu = (mainMenuId: string) => {
    if (mainMenuId === activeMainMenuId) {
      setActiveMainMenuId(null);
      setDropDownMenuList([]);
      return;
    }

    setActiveMainMenuId(mainMenuId);

    setDropDownMenuPosition({
      left: mousePosition.x + 20,
      top: mousePosition.y
    });

    const mainMenuItem = mainMenuList.find((el) => el.id === mainMenuId);
    if (mainMenuItem?.subMenu?.length) {
      setDropDownMenuList(mainMenuItem.subMenu);
    }
    else {
      setDropDownMenuList([]);
    }
  }

  const renderMainMenu = () => {
    return (
      <div>
        <div className="ml-10 flex items-baseline space-x-4 text-white">
          {
            mainMenuList.map((item) => {
              let onClickEvent = undefined;

              if (item.onClick) {
                onClickEvent = () => {
                  if (item.onClick) {
                    item.onClick();
                  }
                  closeAllSubItems(mainMenuList, true);
                }
              } else if (item.subMenu?.length) {
                onClickEvent = () => {
                  showFloatingSubMenu(item.id);
                }
              }

              return (
                <a
                  href={item.link || '#'}
                  key={`large_a_${item.id}`}
                  onClick={onClickEvent}
                  className={getMenuStyle()}>
                    <span>{item.caption}</span>
                </a>
              );
            })
          }
        </div>
      </div>
    );
  }

  const renderDropDownMenu = () => {
    if (!activeMainMenuId) {
      return <></>;
    }

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

    const _renderMenuOptions = (menuItem: MenuItem[]): JSX.Element[] => {
      return menuItem.flatMap(
        (el) => {
          return [
            <li key={`large_li_${el.id}`} className="list-none px-4 py-2 cursor-pointer hover:bg-gray-300 rounded-md">
              <button
                className="text-gray-600 hover:text-gray-900 flex w-full text-left px-4 py-2 break-words"
                onClick={
                  () => {
                    if (el.subMenu?.length) {
                      toggleMenuItem(el.id);
                    }
                    else if (el.onClick) {
                      el.onClick();
                      setActiveMainMenuId(null);
                    }
                  }
                }>
                  { _renderCaption(el) }
              </button>
            </li>,
            ...(el.isOpened && el.subMenu ? _renderMenuOptions(el.subMenu) : [])
          ]
        }
      );
    }

    return (
      <div
        style={{ left: dropDownMenuPosition.left, top: dropDownMenuPosition.top }}
        className="absolute bg-white border rounded-md shadow-md z-10 mt-2">
        <ul className="max-w-[400px] py-2">
          {
            _renderMenuOptions(dropDownMenuList)
          }
        </ul>
      </div>
    )
  }

  return (
    <div className="hidden md:block bg-gray-800">

      <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center" onMouseMove={handleMouseClick}>
            <Avatar/>
            { renderMainMenu() }
          </div>

        </div>
      </div>

      <ClickOutside onClickOutside={ () => { setActiveMainMenuId(null) }}>
        { renderDropDownMenu() }
      </ClickOutside>
    </div>
  );
}
