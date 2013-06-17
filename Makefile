#
# Makefile
#

DIST_NAME = sdc
VERSION=`cat dist/manifest.json | \
	  awk '/\"version/{ gsub(/[",]/, "", $$2); print $$2}'`

all:
	@echo "you mean 'make zip'?"

zip:
	@if [ -e ${DIST_NAME} ]; then \
		(echo "already exist ${DIST_NAME} dir"; exit 1); \
	fi
	ln -s dist ${DIST_NAME}
	zip -r9 "${DIST_NAME}-${VERSION}.zip" ${DIST_NAME}/*
	rm ${DIST_NAME}
	ls -l ${DIST_NAME}-${VERSION}.zip

clean:
	-rm *~
	-rm ${DIST_NAME}-${VERSION}.zip

# EOF
