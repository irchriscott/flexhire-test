FROM ruby:3.3

RUN groupadd -g 1000 flexhire
RUN useradd -m -u 1000 -g flexhire -s /bin/bash flexhire

USER 1000:1000

# Install NVM and Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install v20

# Install rails and bundler
RUN gem install rails bundler

WORKDIR /workspace

CMD ["bash"]