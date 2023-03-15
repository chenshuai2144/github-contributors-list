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
  filter?: (item: AvatarListItem) => boolean;
  emptyRender?: (fileName: string, owner: string, repo: string) => React.ReactNode;
  renderItem?: (item?: AvatarListItem, loading?: boolean) => React.ReactNode;
  cache?: boolean;
}

const successCbQueue: ((items: AvatarListItem[]) => void)[] = [];
const fetchLock: Record<string, boolean> = {};

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
  const url = `https://proapi.azurewebsites.net/doc/getAvatarList?filename=${fileName}&owner=${owner}&repo=${repo}`;
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
  filter = () => true,
  cache = false,
  emptyRender,
}) {
  const [list, setList] = useState<AvatarListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (cache && fetchLock[fileName]) {
      successCbQueue.push((items) => {
        setList(items);
        setLoading(false);
      });
      return;
    }
    // loading
    fetchLock[fileName] = true;
    setLoading(true);
    getAvatarList({ owner, repo, fileName })
      .then(data => {
        setList(data);
        setLoading(false);
        cache && successCbQueue.forEach(fn => fn(data));
      })
      .catch(() => {
        setLoading(false);
        fetchLock[fileName] = false;
      });
  }, [owner, repo, fileName]);

  useEffect(() => () => {
    fetchLock[fileName] = false;
    successCbQueue.splice(0, successCbQueue.length);
  }, [fileName]);


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

  const displayList = list.filter(filter);

  return (
    <>
      <ul
        className={className}
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flexFlow: 'wrap',
          ...style,
        }}
      >
        {displayList.map(item => {
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
        {displayList.length === 0 && emptyRender && emptyRender(fileName, owner, repo)}
      </ul>
    </>
  );
};

export default AvatarList;
