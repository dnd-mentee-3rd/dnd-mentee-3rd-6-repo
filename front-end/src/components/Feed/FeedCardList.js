import React from 'react';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';

import {
  CardTitle,
  CardIcon,
  CardContent,
  CardContentText,
  CardItem,
  CardList,
  LastFeed,
  // FeedCardContentButton,
} from './styles';
import LIkeIcon from '../../lib/style/feedIcon/LIkeIcon';
import ComentIcon from '../../lib/style/feedIcon/ComentIcon';
import SaveIcon from '../../lib/style/feedIcon/SaveIcon';
import CardImageWrapprer from './CardImageWrapprer';

const CardItems = ({ feed, onClickUnlike, onClickLike, onClickComment }) => {
  return (
    <CardItem>
      <CardTitle>
        <dl className="feed-card__title-column">
          <dt>
            <img
              src={`${
                process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BASE_URL : ''
              }${feed.author.profileImg}`}
              alt={feed.author.nickName}
            />
          </dt>
          <dd>{feed.author.nickName}</dd>
        </dl>
        <div className="feed-card__title-column">{feed.author.addressName}</div>
      </CardTitle>
      <CardImageWrapprer feed={feed} />
      <CardIcon>
        <div className="feed-card__icon-column">
          <div className="icon--item">
            <button
              type="button"
              onClick={feed.isLike ? onClickUnlike(feed.id) : onClickLike(feed.id)}
            >
              <LIkeIcon like={feed.isLike} />
            </button>
            <span>{feed.numberOfLikes}</span>
          </div>
          <div className="icon--item">
            <button type="button" onClick={onClickComment(feed.id)}>
              <ComentIcon />
            </button>
            <span>{feed.numberOfComments}</span>
          </div>
        </div>
        <div className="feed-card__icon-column">
          <SaveIcon />
        </div>
      </CardIcon>
      <CardContent>
        <div className="feed-card__content-column">
          <CardContentText>{feed.content}</CardContentText>
          {/* <FeedCardContentButton type="button" length={hang.length}>
더보기
</FeedCardContentButton> */}
        </div>
        <div className="feed-card__content-column">
          <p>{feed.timeDesc}</p>
        </div>
      </CardContent>
    </CardItem>
  );
};

const FeedCardList = ({
  contents,
  onClickLike,
  onClickUnlike,
  onClickComment,
  getLoading,
  isLast,
  onScrollFeed,
}) => {
  return (
    <section className="scroll" onScroll={onScrollFeed}>
      <CardList>
        {contents.map((feed) => (
          <CardItems
            key={feed.id}
            feed={feed}
            onClickLike={onClickLike}
            onClickUnlike={onClickUnlike}
            onClickComment={onClickComment}
          />
        ))}
      </CardList>
      {getLoading && (
        <LastFeed last="true">
          <LoadingOutlined />
        </LastFeed>
      )}
      {isLast && <LastFeed>더 이상 올라온 글이 없다냥 ㅠ_ㅠ</LastFeed>}
    </section>
  );
};

FeedCardList.prototype = {
  contents: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    author: PropTypes.object,
    comments: PropTypes.arrayOf(PropTypes.object),
    isLike: PropTypes.bool,
    numberOfLikes: PropTypes.number,
    numberOfComments: PropTypes.number,
    createdDateTime: PropTypes.string,
    timeDesc: PropTypes.string,
  }).isRequired,
  onClickLike: PropTypes.func.isRequired,
  onClickUnlike: PropTypes.func.isRequired,
  onClickComment: PropTypes.func.isRequired,
  // onClickShowText: PropTypes.func.isRequired,
  getLoading: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  onScrollFeed: PropTypes.func.isRequired,
};

FeedCardList.defaultProps = {
  contents: [],
};

export default React.memo(FeedCardList);
