import React, { useEffect, useState } from 'react';

export interface AvatarListItem {
  username?: string;
  url?: string;
}

export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  fileName: string;
  owner: string;
  repo: string;
  renderItem?: (item?: AvatarListItem, loading?: boolean) => React.ReactNode;
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
  const url = `https://github-contributors-list.azurewebsites.net/api/getAvatarList?code=GPhCUq8TpjewUtWN4SK1bo71AfEtOw8utSjqaqbFcmWB1sThCKfsHQ==&filename=${fileName}&owner=${owner}&repo=${repo}`;
  const data = await fetch(url, { mode: 'cors' })
    .then(res => res.json())
    .catch(e => console.log(e));
  if (!data) {
    return [];
  }
  return data;
};

const AvatarList: React.FC<ButtonProps> = function({
  className,
  renderItem,
  repo,
  owner,
  style,
  fileName,
}) {
  const [list, setList] = useState<AvatarListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    getAvatarList({ owner, repo, fileName })
      .then(data => {
        setList(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [owner, repo, fileName]);

  if (loading) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          ...style,
        }}
      >
        {(renderItem && renderItem({}, true)) || <span>loading</span>}
      </div>
    );
  }
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
          if (renderItem) {
            return renderItem(item, loading);
          }
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
