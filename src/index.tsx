import React, { useEffect, useState } from 'react';

export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  fileName: string;
}

export interface AvatarListItem {
  username: string;
  url: string;
}

// 获取头像列表
const getAvatarList = async (filename: string) => {
  const sourcePath = 'https://github.com/ant-design/ant-design/contributors-list/master/';
  const url = `${sourcePath}${filename}`;
  const html = await fetch(url, { mode: 'cors' })
    .then(res => res.text())
    .catch(e => console.log(e));
  if (!html) {
    return [];
  }
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('li a').forEach(ele => {
    const img = ele.querySelector('img');
    if (!img) {
      return;
    }
    data.push({
      username: (ele.textContent || '').trim(),
      url: img.src,
    });
  });
  const data: AvatarListItem[] = [];

  return data;
};

const AvatarList: React.FC<ButtonProps> = function({ className, style, fileName }) {
  const [list, setList] = useState<AvatarListItem[]>([]);
  useEffect(() => {
    getAvatarList(fileName).then(data => {
      setList(data);
    });
  }, []);
  const sourcePath = 'https://github.com/ant-design/ant-design/contributors-list/master';
  const url = `${sourcePath}${fileName}`;
  fetch('http://api.github.com/repos/octocat/Hello-World/contributors');
  return (
    <>
      <ul className={className} style={style}>
        {list.map(item => {
          return (
            <a href={`https://github.com/${item.username}`}>
              <img src={item.username} alt={item.username} />
            </a>
          );
        })}
      </ul>
    </>
  );
};

export default AvatarList;
