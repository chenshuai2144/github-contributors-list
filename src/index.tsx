import React, { useEffect, useState } from 'react';

export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  fileName: string;
  owner: string;
  repo: string;
}

export interface AvatarListItem {
  username: string;
  url: string;
}

// 获取头像列表
const getAvatarList = async ({
  fileName,
  repo,
  owner,
}: {
  owner: string;
  repo: string;
  fileName: string;
}): Promise<AvatarListItem[]> => {
  const url = `http://localhost:7071/api/getAvatarList?filename=${fileName}&owner=${owner}&repo=${repo}`;
  const data = await fetch(url, { mode: 'cors' })
    .then(res => res.json())
    .catch(e => console.log(e));
  if (!data) {
    return [];
  }
  return data;
};

const AvatarList: React.FC<ButtonProps> = function({ className, repo, owner, style, fileName }) {
  const [list, setList] = useState<AvatarListItem[]>([]);
  useEffect(() => {
    getAvatarList({ owner, repo, fileName }).then(data => {
      setList(data);
    });
  }, []);
  return (
    <>
      <ul
        className={className}
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          ...style,
        }}
      >
        {list.map(item => {
          return (
            <li
              style={{
                marginRight: 8,
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #ddd',
              }}
            >
              <a href={`https://github.com/${item.username}`}>
                <img width={40} src={item.url} alt={item.username} />
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default AvatarList;
