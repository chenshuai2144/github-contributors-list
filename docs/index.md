# AvatarList Component

## simple

```jsx
import AvatarList from '@qixian.cs/github-contributors-list';

export default () => (
  <AvatarList repo="ant-design" owner="ant-design" fileName="/components/layout/index.en-US.md" />
);
```

## render Item

```jsx
import AvatarList from '@qixian.cs/github-contributors-list';

export default () => (
  <AvatarList
    repo="ant-design"
    owner="ant-design"
    fileName="/components/layout/index.en-US.md"
    renderItem={(item, loading) => {
      if (loading) {
        return 'loading';
      }
      return (
        <div
          style={{
            marginRight: 8,
            overflow: 'hidden',
            border: '1px solid red',
          }}
        >
          <a
            href={`https://github.com/${item.username}`}
            style={{
              display: 'flex',
            }}
          >
            <img width={24} src={item.url} alt={item.username} />
          </a>
        </div>
      );
    }}
  />
);
```
