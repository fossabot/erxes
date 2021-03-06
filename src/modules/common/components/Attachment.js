import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'modules/common/components';

const Overlay = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  transition: all 0.2s ease;

  > div {
    position: absolute;
    color: #fff;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    line-height: 28px;
    left: 50%;
    top: 50%;
    border: 1px solid #fff;
    margin-left: -15px;
    margin-top: -15px;

    i {
      margin: 0;
    }
  }
`;

const DownloadAttachment = styled.a`
  display: inline-block;
  position: relative;
  cursor: pointer;
  max-width: 360px;
  transition: all ease 0.3s;
  color: inherit;

  img {
    max-width: 100%;
  }

  &:hover ${Overlay}, &:hover ${Overlay} > div {
    opacity: 1;
  }
`;

const FileWrapper = styled.div`
  position: relative;
  padding-left: 40px;
  padding-right: 20px;
  min-width: 120px;
  min-height: 36px;
  line-height: 36px;

  i {
    font-size: 26px;
    position: absolute;
    left: 10px;
    top: 0;
  }

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    direction: rtl;
    text-align: left;
    max-width: 200px;
    display: block;
  }
`;

class Attachment extends Component {
  constructor(props) {
    super(props);

    this.renderAtachment = this.renderAtachment.bind(this);
    this.renderOtherFile = this.renderOtherFile.bind(this);
    this.onLoadImage = this.onLoadImage.bind(this);
  }

  renderOtherFile(name, icon) {
    return (
      <FileWrapper>
        <Icon icon={icon} /> <span>{name}</span>
      </FileWrapper>
    );
  }

  onLoadImage() {
    this.props.scrollBottom();
  }

  renderAtachment({ attachment }) {
    if (attachment.type.startsWith('image')) {
      return (
        <img
          onLoad={this.onLoadImage}
          alt={attachment.url}
          src={attachment.url}
        />
      );
    }

    const url = attachment.url || attachment.name || '';
    const name = attachment.name || attachment.url || '';
    const fileExtension = url.split('.').pop();

    let filePreview;
    switch (fileExtension) {
      case 'png':
      case 'jpeg':
      case 'jpg':
        filePreview = <img alt={url} src={url} />;
        break;
      case 'doc':
      case 'docx':
      case 'txt':
      case 'pdf':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
        filePreview = this.renderOtherFile(name, 'document-text');
        break;
      case 'mp4':
      case 'avi':
        filePreview = this.renderOtherFile(name, 'videocamera');
        break;
      case 'mp3':
      case 'wav':
        filePreview = this.renderOtherFile(name, 'volume-mediu');
        break;
      case 'zip':
        filePreview = this.renderOtherFile(name, 'android-archive');
        break;
      default:
        filePreview = this.renderOtherFile(name, 'document');
    }
    return filePreview;
  }

  render() {
    const props = this.props;
    return (
      <DownloadAttachment href={props.attachment.url} target="_blank">
        {this.renderAtachment(props)}
        <Overlay>
          <div>
            <Icon icon="android-download" />
          </div>
        </Overlay>
      </DownloadAttachment>
    );
  }
}

Attachment.propTypes = {
  attachment: PropTypes.object.isRequired,
  scrollBottom: PropTypes.func
};

export default Attachment;
