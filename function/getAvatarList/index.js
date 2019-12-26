const fetch = require('node-fetch');
const cheerio = require('cheerio');

// 获取头像列表
const getAvatarList = async ({ filename, owner, repo }) => {
  const sourcePath = `https://github.com/${owner}/${repo}/contributors-list/master/`;
  const url = `${sourcePath}${filename}`;
  const html = await fetch(url)
    .then(res => {
      if (res.status === 200) {
        return res.text();
      }
      return Promise.resolve(null);
    })
    .catch(e => console.log(e));
  if (!html) {
    return [];
  }
  const $ = cheerio.load(html || '');
  const data = [];
  $('li a').map((_, ele) => {
    data.push({
      username: $(ele)
        .text()
        .trim(),
      url: $(ele)
        .children('img')
        .attr('src'),
    });
    return false;
  });
  return data;
};

const httpTrigger = async function(context, req) {
  const { filename, repo, owner } = req.query;
  if (filename && repo && owner) {
    const list = await getAvatarList({
      filename,
      repo,
      owner,
    });
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: list,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Header':
          'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
      },
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body',
    };
  }
};
module.exports = httpTrigger;
