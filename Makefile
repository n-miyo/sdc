#
#
#

DIST_NAME = SearchWithDate
DIST_TARGET = \
  background.html \
  icon0.png \
  icon128.png \
  manifest.json
VERSION=`cat manifest.json | \
	  awk '/version/{ gsub(/[",]/, "", $$2); print $$2}'`

all:

dist:
	mkdir ${DIST_NAME}
	cp -a ${DIST_TARGET} ${DIST_NAME}
	zip -9 "${DIST_NAME}-${VERSION}.zip" ${DIST_NAME}/*
	rm -rf ${DIST_NAME}
	ls -l ${DIST_NAME}-${VERSION}.zip

# EOF
