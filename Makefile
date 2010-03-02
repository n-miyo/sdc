#
# Makefile
#

DIST_NAME = SearchDateChanger
DIST_TARGET = \
  background.html \
  icon0.png \
  icon1.png \
  icon2.png \
  icon3.png \
  icon4.png \
  icon128.png \
  manifest.json
VERSION=`cat manifest.json | \
	  awk '/version/{ gsub(/[",]/, "", $$2); print $$2}'`

all:
	@echo "you mean 'make dist'?"

dist:
	mkdir ${DIST_NAME}
	cp -a ${DIST_TARGET} ${DIST_NAME}
	zip -9 "${DIST_NAME}-${VERSION}.zip" ${DIST_NAME}/*
	rm -rf ${DIST_NAME}
	ls -l ${DIST_NAME}-${VERSION}.zip

clean:
	-rm *~
	-rm ${DIST_NAME}-${VERSION}.zip

# EOF
