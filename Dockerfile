FROM kthse/kth-nodejs:12.0.0

COPY ["package-lock.json", "package-lock.json"]
COPY ["package.json", "package.json"]

RUN npm install --production --no-optional

# Copy files used by Gulp.
COPY ["config", "config"]
COPY ["package.json", "package.json"]

# Copy source files, so changes does not trigger gulp.
COPY ["app.js", "app.js"]
COPY ["swagger.json", "swagger.json"]
COPY ["server", "server"]
COPY ["data", "data"]

EXPOSE 3001

CMD ["node", "app.js"]
